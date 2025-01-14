import GlobalCounter from "@/components/global-counter";
import CallerCounter from "@/components/caller-counter";
import Chat from "@/components/chat";

export default function Home() {
    return (
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            <div
                className="relative hidden flex-col items-start gap-8 md:flex"
                x-chunk="dashboard-03-chunk-0"
            >
                <div className="grid w-full items-start gap-6">
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Settings
                        </legend>
                        <div className="grid gap-3"></div>
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
            <Chat />
        </main>
    );
}
