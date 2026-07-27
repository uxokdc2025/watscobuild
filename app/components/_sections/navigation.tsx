"use client";

import * as React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Category, Demo, Block } from "../_showcase";

export function NavigationSection() {
  return (
    <Category
      id="navigation"
      title="Navigation"
      description="Wayfinding controls. Selected, disabled, and current-page states are shown; hover/focus are live."
    >
      {/* ── Tabs ── */}
      <Demo name="Tabs" slug="tabs" className="items-stretch">
        <Block label="Default (tab 1 selected, tab 3 disabled)">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="team" disabled>
                Team
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="account"
              className="pt-3 text-sm text-muted-foreground"
            >
              Manage your account settings and preferences.
            </TabsContent>
            <TabsContent
              value="password"
              className="pt-3 text-sm text-muted-foreground"
            >
              Change your password here.
            </TabsContent>
          </Tabs>
        </Block>

        <Block label="Line — underline, brand-colored active tab">
          <Tabs defaultValue="equipment">
            <TabsList variant="line">
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="supplies">Supplies</TabsTrigger>
            </TabsList>
            <TabsContent
              value="equipment"
              className="pt-3 text-sm text-muted-foreground"
            >
              Frequently bought equipment.
            </TabsContent>
            <TabsContent
              value="parts"
              className="pt-3 text-sm text-muted-foreground"
            >
              Replacement parts and components.
            </TabsContent>
            <TabsContent
              value="supplies"
              className="pt-3 text-sm text-muted-foreground"
            >
              Consumable supplies.
            </TabsContent>
          </Tabs>
        </Block>

        <Block label="Segmented — solid pill (Pack Size selector style)">
          <Tabs defaultValue="each">
            <TabsList variant="segmented">
              <TabsTrigger value="each">Each</TabsTrigger>
              <TabsTrigger value="12">12-Pk</TabsTrigger>
              <TabsTrigger value="24">24-Pk</TabsTrigger>
              <TabsTrigger value="36">36-Pk</TabsTrigger>
            </TabsList>
            <TabsContent
              value="each"
              className="pt-3 text-sm text-muted-foreground"
            >
              Priced per each.
            </TabsContent>
            <TabsContent
              value="12"
              className="pt-3 text-sm text-muted-foreground"
            >
              12-pack pricing.
            </TabsContent>
            <TabsContent
              value="24"
              className="pt-3 text-sm text-muted-foreground"
            >
              24-pack pricing.
            </TabsContent>
            <TabsContent
              value="36"
              className="pt-3 text-sm text-muted-foreground"
            >
              36-pack pricing.
            </TabsContent>
          </Tabs>
        </Block>
      </Demo>

      {/* ── Breadcrumb ── */}
      <Demo name="Breadcrumb" slug="breadcrumb" className="items-start">
        <Block label="Current page = last item">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Block>
      </Demo>

      {/* ── Pagination ── */}
      <Demo name="Pagination" slug="pagination" className="items-start">
        <Block label="Page 2 selected">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Block>
      </Demo>
    </Category>
  );
}
