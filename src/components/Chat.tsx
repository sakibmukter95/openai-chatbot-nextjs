"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import CopyToClipboard from "@/components/CopyToClipBoard";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import Typewriter from 'typewriter-effect';
import { SendHorizontalIcon, Zap } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { AddFreeCredits } from "@/lib/action";
import Image from "next/image";

export default function Chat() {
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, session } = useClerk();

  const credits = user?.publicMetadata?.credits;
  const newUser = typeof credits === "undefined";
  const paidUser = user?.publicMetadata?.stripeCustomerId;

  const ref = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: "system",
          content: "You are an assistant that gives short answers.",
        },
      ],
      onResponse: (response) => {
        if (!response.ok) {
          const status = response.status;

          switch (status) {
            case 401:
              openSignIn();
              break;
            case 402:
              toast.error("You have no credits left.", {
                action: {
                  label: "Get more",
                  onClick: () => setSubscriptionDialogOpen(true),
                },
              });
              break;
            default:
              toast.error(error?.message || "Something went wrong!");
              break;
          }
        }
        session?.reload();
      },
    });

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSignedIn) {
      handleSubmit(e);
    } else {
      openSignIn();
    }
  }

  async function handleClick() {
    const { success, error } = await AddFreeCredits();

    console.log(success, error);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("10 credits added successfully.");
    session?.reload();
  }

  return (
    <section className="py-12 text-zinc-700 container mx-auto lg:py-24">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-1">
        {/* Chat section */}
        <div className="flex-1 w-full max-w-3xl lg:w-auto">
          {/* Credits section */}
          <div className="mx-auto flex max-w-lg items-center justify-between px-1">
            <div>
              {isSignedIn && newUser && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500"
                  onClick={handleClick}
                >
                  Redeem 10 Free Credits
                </Button>
              )}
              {isSignedIn && typeof credits === "number" && (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-zinc-800">Credits:</span>
                  <span className="font-medium">{credits}</span>
                </div>
              )}
            </div>
            {isSignedIn && !paidUser && !newUser && (
              <Button
                size="sm"
                onClick={() => setSubscriptionDialogOpen(true)}
                className="bg-white text-zinc-800"
              >
                Get more credits
              </Button>
            )}
          </div>

          {/* Chat area */}
          <div className="mx-4 mt-3 max-w-lg lg:mx-auto">
            <ScrollArea
              className="mb-2 h-[400px] rounded-md border bg-white p-4 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]"
              ref={ref}
            >
              {messages.map((m) => (
                <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
                  {m.role === "user" && (
                    <div className="mb-6 flex gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="text-sm">U</AvatarFallback>
                      </Avatar>
                      <div className="mt-1.5">
                        <p className="font-semibold">You</p>
                        <div className="mt-1.5 text-sm text-zinc-500">
                          {m.content}
                        </div>
                      </div>
                    </div>
                  )}

                  {m.role === "assistant" && (
                    <div className="mb-6 flex gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className='bg-emerald-500 text-white p-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='50'
                          height='50'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fill='currentColor'
                            d='M12 5.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2Zm-5 1a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm3.5-4a.5.5 0 0 0-1 0V3h-3A1.5 1.5 0 0 0 5 4.5v4A1.5 1.5 0 0 0 6.5 10h6.294l.326-1H6.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3.583a1.423 1.423 0 0 1 1 .016V4.5A1.5 1.5 0 0 0 13.5 3h-3v-.5Zm-2 9h1.908a1.415 1.415 0 0 0-.408.997v.006H5.31a.81.81 0 0 0-.81.81v.437c0 .69.131 1.456.802 2.069C5.99 16.446 7.34 17 10 17c1.55 0 2.655-.188 3.444-.47a1.422 1.422 0 0 0 .678.419a1.3 1.3 0 0 0-.117.439c-.916.367-2.137.59-3.755.61V18h-.5v-.002c-2.616-.033-4.195-.595-5.122-1.44c-.875-.8-1.089-1.777-1.123-2.556H3.5v-.69c0-.999.81-1.809 1.81-1.809H8.5V11.5Zm6.378-2.218l.348 1.071a2.206 2.206 0 0 0 1.399 1.397l1.071.348l.021.006a.423.423 0 0 1 0 .798l-1.071.348a2.207 2.207 0 0 0-1.399 1.397l-.348 1.07a.423.423 0 0 1-.798 0l-.349-1.07a2.218 2.218 0 0 0-.65-.977a2.208 2.208 0 0 0-.748-.426l-1.071-.348a.423.423 0 0 1 0-.798l1.071-.348a2.208 2.208 0 0 0 1.377-1.397l.348-1.07a.423.423 0 0 1 .799 0Zm4.905 7.931l-.766-.248a1.578 1.578 0 0 1-.998-.998l-.25-.765a.302.302 0 0 0-.57 0l-.248.764a1.576 1.576 0 0 1-.984.999l-.765.248a.303.303 0 0 0-.146.46c.036.05.087.09.146.11l.765.249a1.578 1.578 0 0 1 1 1.002l.248.764a.302.302 0 0 0 .57 0l.249-.764a1.576 1.576 0 0 1 .999-.999l.765-.248a.302.302 0 0 0 0-.57l-.015-.004Zm-6.174-.527l.07.053Z'
                          />
                        </svg>
                      </AvatarFallback>
                      </Avatar>
                      <div className="mt-1.5 w-full">
                        <div className="flex justify-between">
                          <p className="font-semibold">NextBOT</p>
                          <CopyToClipboard message={m} className="-mt-1" />
                        </div>
                        <div className="mt-2 text-sm text-zinc-500">
                          {m.content}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>

            <form
              onSubmit={onSubmit}
              className="rounded-md relative shadow-[2px_4px_53px_0px_#f4c8d5]"
            >
              <Input
                name="message"
                value={input}
                onChange={handleInputChange}
                placeholder={
                  isSignedIn ? "Message to NextBOT..." : "Sign in to start..."
                }
                className="pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500"
              />
              <Button
                size="icon"
                type="submit"
                variant="secondary"
                disabled={isLoading || !isLoaded}
                className="absolute right-1 top-1 h-8 w-10"
              >
                <SendHorizontalIcon className="h-5 w-5 text-emerald-500" />
              </Button>
            </form>
          </div>

          {/* Subscription dialog */}
          <SubscriptionDialog
            open={subscriptionDialogOpen}
            onOpenChange={setSubscriptionDialogOpen}
          />
        </div>

        {/* Image section */}
        <div className="flex-1 w-full lg:w-auto flex-shrink-0">
          <div className="items-center justify-center text-center text-3xl font-bold text-zinc-700">
          <Typewriter
              options={{
              strings: ['OpenAI API', 'Next.Js', 'MongoDB', 'shadcn/ui', 'Clerk', 'Stripe'],
              autoStart: true,
              loop: true,
              deleteSpeed:25,
              delay:50
              }}
            />
          </div>
           
          <Image
            src={"/chatBot.png"}
            width={450}
            height={450}
            alt="Chatbot"
            className="w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
