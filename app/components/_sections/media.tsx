"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselHeader,
  CarouselItem,
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
          <div className="mx-auto w-full max-w-xs">
            <Carousel className="flex flex-col gap-3">
              <CarouselHeader>
                <span className="text-sm font-medium">Gallery</span>
                <CarouselControls />
              </CarouselHeader>
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
            </Carousel>
          </div>
        </Block>
        <Block label="Multiple items per view (product rails)">
          <Carousel opts={{ align: "start" }} className="flex w-full flex-col gap-3">
            <CarouselHeader>
              <span className="text-sm font-medium">Products</span>
              <CarouselControls />
            </CarouselHeader>
            <CarouselContent>
              {Array.from({ length: 8 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold">{i + 1}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Block>
      </Demo>
    </Category>
  );
}
