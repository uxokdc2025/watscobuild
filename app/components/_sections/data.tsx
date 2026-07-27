"use client";

import * as React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, Demo, State, Block } from "../_showcase";

const ROWS = [
  { id: "INV-001", status: "Paid", total: "$250.00" },
  { id: "INV-002", status: "Pending", total: "$150.00" },
  { id: "INV-003", status: "Unpaid", total: "$350.00" },
  { id: "INV-004", status: "Paid", total: "$120.00" },
];

export function DataSection() {
  return (
    <Category
      id="data"
      title="Data Display"
      description="Containers and structured content. Table rows show default, hover (live), and selected states."
    >
      {/* ── Card ── */}
      <Demo name="Card" slug="card" className="items-stretch">
        <Block label="Default">
          <Card>
            <CardHeader>
              <CardTitle>Project Nova</CardTitle>
              <CardDescription>Deployed 2 minutes ago</CardDescription>
              <CardAction>
                <Badge variant="secondary">Live</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A card groups related content and actions into a single surface.
            </CardContent>
            <CardFooter className="gap-2">
              <Button size="sm">Open</Button>
              <Button size="sm" variant="outline">
                Settings
              </Button>
            </CardFooter>
          </Card>
        </Block>
        <Block label="Selected (ring)">
          <Card className="ring-2 ring-ring">
            <CardHeader>
              <CardTitle>Selected card</CardTitle>
              <CardDescription>Highlighted with a focus ring</CardDescription>
            </CardHeader>
          </Card>
        </Block>
      </Demo>

      {/* ── Table ── */}
      <Demo name="Table" slug="table">
        <Block label="Row states + zebra striping (bg-muted/40)">
          <Table className="[&_tbody_tr:nth-child(even)]:bg-muted/40">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r, i) => (
                <TableRow key={r.id} data-state={i === 1 ? "selected" : undefined}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell className="text-right">{r.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground">
            Middle row is <code>data-state=&quot;selected&quot;</code>; hover any row.
          </p>
        </Block>
      </Demo>

      {/* ── Avatar ── */}
      <Demo name="Avatar" slug="avatar">
        <State label="Image">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </State>
        <State label="Fallback">
          <Avatar>
            <AvatarImage src="" alt="broken" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </State>
        <State label="With badge">
          <Avatar>
            <AvatarFallback>ok</AvatarFallback>
            <AvatarBadge className="bg-in-stock" />
          </Avatar>
        </State>
        <State label="Group">
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </State>
      </Demo>

      {/* ── Separator ── */}
      <Demo name="Separator" slug="separator" className="items-start">
        <Block label="Horizontal">
          <div className="text-sm">
            <div className="font-medium">Radix Primitives</div>
            <div className="text-muted-foreground">An open-source UI kit.</div>
            <Separator className="my-3" />
            <div className="flex h-5 items-center gap-3 text-muted-foreground">
              <span>Blog</span>
              <Separator orientation="vertical" />
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Source</span>
            </div>
          </div>
        </Block>
      </Demo>

      {/* ── Accordion ── */}
      <Demo name="Accordion" slug="accordion" className="items-stretch">
        <Block label="Default (item 1 open)">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that match the other
                components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes, with a CSS-driven open/close transition.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Block>
      </Demo>
    </Category>
  );
}
