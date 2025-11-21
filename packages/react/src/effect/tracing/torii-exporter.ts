import type {
    SpanExporter,
    ReadableSpan,
} from "@opentelemetry/sdk-trace-base";
import type { ExportResult } from "@opentelemetry/core";
import { ExportResultCode } from "@opentelemetry/core";
import { SpanStatusCode } from "@opentelemetry/api";

export class ToriiSpanExporter implements SpanExporter {
    export(
        spans: ReadableSpan[],
        resultCallback: (result: ExportResult) => void
    ): void {
        for (const span of spans) {
            const durationMs = (
                span.duration[0] * 1000 +
                span.duration[1] / 1_000_000
            ).toFixed(2);
            const operation = span.name.replace("torii.", "");
            const status =
                span.status.code === SpanStatusCode.ERROR ? "\u274C" : "\u2705";

            console.log(
                "\u26E9" + ` Torii - ${operation} - ${durationMs}ms ${status}`,
                span.attributes
            );
        }
        resultCallback({ code: ExportResultCode.SUCCESS });
    }

    shutdown(): Promise<void> {
        return Promise.resolve();
    }
}
