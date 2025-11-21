import {
    BasicTracerProvider,
    SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { ToriiSpanExporter } from "./torii-exporter";
import { trace } from "@opentelemetry/api";
import { Tracer, Resource } from "@effect/opentelemetry";
import { Layer } from "effect";

let otelProvider: BasicTracerProvider | undefined;

export interface TracingOptions {
    serviceName: string;
    enabled: () => boolean;
}

export function initTracing(options: TracingOptions): void {
    if (!options.enabled()) return;

    const exporter = new ToriiSpanExporter();
    const processor = new SimpleSpanProcessor(exporter);

    otelProvider = new BasicTracerProvider({
        spanProcessors: [processor],
    });

    trace.setGlobalTracerProvider(otelProvider);

    console.log(
        `[Tracing] Initialized console tracing for ${options.serviceName}`
    );
}

export function makeTracingLayer(options: TracingOptions): Layer.Layer<never> {
    if (!options.enabled()) {
        return Layer.empty;
    }

    initTracing(options);

    return Layer.provide(
        Tracer.layerGlobal,
        Resource.layer({ serviceName: options.serviceName })
    );
}

export { ToriiSpanExporter };
