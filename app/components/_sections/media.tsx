"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Category, Demo, Block } from "../_showcase";

export function MediaSection() {
  return (
    <Category
      id="media"
      title="Media"
      description="Swipeable content. At the first slide the Previous control is disabled — use the arrows or drag."
    >
      <Demo name="Carousel" slug="carousel" className="items-stretch">
        <Block label="Default (Previous disabled at start)">
          <div className="flex justify-center px-10">
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, i) => (
                  <CarouselItem key={i}>
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{i + 1}</span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </Block>
      </Demo>
    </Category>
  );
}
