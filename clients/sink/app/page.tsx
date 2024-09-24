"use client"

import {
  CornerDownLeft,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDojoDb } from "@/dojo/provider"
import { useCallback, useEffect, useState } from "react"
import { OnchainDashSchemaType } from "@/dojo/models"
import { SDK } from "@dojoengine/sdk"
import { useForm } from "react-hook-form"
import { Subscription } from "@dojoengine/torii-client"
import GlobalCounter from "@/components/global-counter"
import CallerCounter from "@/components/caller-counter"

export default function Home() {
  const [subscription, setSubscription] = useState<Subscription>()
  const { register, handleSubmit } = useForm();

  const db = useDojoDb();
  useEffect(() => {
    async function getEntities(db: SDK<OnchainDashSchemaType>) {
      const sub = await db.subscribeEntityQuery(
        {
          world: {
            global_counter: {
              $: {
              },
            },
            caller_counter: {
              $: {
              }
            }
          },
        },
        (response) => {
          if (response.error) {
            console.error(
              "Error querying todos and goals:",
              response.error
            );
            return;
          }
          if (response.data) {
            console.log(response.data)
          }
        }
      );
      setSubscription(sub)
    }

    if (db && !subscription) {
      getEntities(db)
    }

    return () => {
      if (subscription) {
        if (subscription.free) {
          subscription.free();
        }
      }
    }
  }, [db, subscription])


  const publish = useCallback(async (data) => {
    console.log("publish", data)
  }, [])

  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
      >
        <div className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Settings
            </legend>
            <div className="grid gap-3">
            </div>
          </fieldset>
          <CallerCounter />
          <GlobalCounter />
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Stats
            </legend>
            <div className="grid gap-3">
              Some stats about whats happening
            </div>
          </fieldset>
        </div>
      </div>
      <form className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2" onSubmit={handleSubmit((data) => publish(data))}>
        <Badge variant="outline" className="absolute right-3 top-3">
          Output
        </Badge>
        <div className="flex-1" />
        <div
          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
        >
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            {...register("message")}
          />
          <div className="flex items-center p-3 pt-0">
            <Button size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
