"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Demo, State } from "../_showcase";

const FOCUS = "border-ring ring-[3px] ring-ring/50";

export function FormsSection() {
  return (
    <Category
      id="forms"
      title="Forms & Inputs"
      description="Text entry and selection controls, each shown across its interaction and validation states."
    >
      {/* ── Input ── */}
      <Demo name="Input" slug="input" className="items-start">
        <State label="Default">
          <Input className="w-40" placeholder="Email" />
        </State>
        <State label="Focus">
          <Input className={`w-40 ${FOCUS}`} placeholder="Email" />
        </State>
        <State label="Disabled">
          <Input className="w-40" placeholder="Email" disabled />
        </State>
        <State label="Error">
          <Input className="w-40" defaultValue="not-an-email" aria-invalid />
        </State>
      </Demo>

      {/* ── Label ── */}
      <Demo
        name="Label"
        slug="label"
        description="Pairs with a control; dims when its control is disabled."
        className="items-start"
      >
        <State label="Default">
          <div className="grid gap-2">
            <Label htmlFor="lbl-1">Full name</Label>
            <Input id="lbl-1" className="w-48" placeholder="Ada Lovelace" />
          </div>
        </State>
        <State label="Disabled">
          <div className="grid gap-2" data-disabled>
            <Label htmlFor="lbl-2" className="peer-disabled:opacity-50">
              Full name
            </Label>
            <Input id="lbl-2" className="peer w-48" placeholder="—" disabled />
          </div>
        </State>
      </Demo>

      {/* ── Textarea ── */}
      <Demo name="Textarea" slug="textarea" className="items-start">
        <State label="Default">
          <Textarea className="w-48" placeholder="Message" />
        </State>
        <State label="Focus">
          <Textarea className={`w-48 ${FOCUS}`} placeholder="Message" />
        </State>
        <State label="Disabled">
          <Textarea className="w-48" placeholder="Message" disabled />
        </State>
        <State label="Error">
          <Textarea className="w-48" defaultValue="Too short" aria-invalid />
        </State>
      </Demo>

      {/* ── Checkbox ── */}
      <Demo name="Checkbox" slug="checkbox">
        <State label="Default">
          <Checkbox aria-label="default" />
        </State>
        <State label="Selected">
          <Checkbox defaultChecked aria-label="selected" />
        </State>
        <State label="Focus">
          <Checkbox className={FOCUS} aria-label="focus" />
        </State>
        <State label="Disabled">
          <Checkbox disabled aria-label="disabled" />
        </State>
        <State label="Disabled + on">
          <Checkbox disabled defaultChecked aria-label="disabled selected" />
        </State>
        <State label="Error">
          <Checkbox aria-invalid aria-label="error" />
        </State>
      </Demo>

      {/* ── Radio Group ── */}
      <Demo name="Radio Group" slug="radio-group" className="items-start">
        <State label="Default / Selected">
          <RadioGroup defaultValue="a" className="gap-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="r-a" />
              <Label htmlFor="r-a">Selected</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="r-b" />
              <Label htmlFor="r-b">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="c" id="r-c" disabled />
              <Label htmlFor="r-c" className="opacity-50">
                Disabled
              </Label>
            </div>
          </RadioGroup>
        </State>
        <State label="Focus">
          <RadioGroup defaultValue="x" className="gap-3">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="x" id="r-x" className={FOCUS} />
              <Label htmlFor="r-x">Focused</Label>
            </div>
          </RadioGroup>
        </State>
      </Demo>

      {/* ── Switch ── */}
      <Demo name="Switch" slug="switch">
        <State label="Off">
          <Switch aria-label="off" />
        </State>
        <State label="On (selected)">
          <Switch defaultChecked aria-label="on" />
        </State>
        <State label="Focus">
          <Switch className={FOCUS} aria-label="focus" />
        </State>
        <State label="Disabled">
          <Switch disabled aria-label="disabled" />
        </State>
        <State label="Disabled + on">
          <Switch disabled defaultChecked aria-label="disabled on" />
        </State>
      </Demo>

      {/* ── Slider ── */}
      <Demo name="Slider" slug="slider" className="items-start">
        <State label="Default" className="w-48">
          <Slider defaultValue={[50]} max={100} step={1} className="w-48" />
        </State>
        <State label="Range" className="w-48">
          <Slider defaultValue={[25, 75]} max={100} step={1} className="w-48" />
        </State>
        <State label="Disabled" className="w-48">
          <Slider defaultValue={[40]} max={100} step={1} disabled className="w-48" />
        </State>
      </Demo>

      {/* ── Select ── */}
      <Demo name="Select" slug="select" className="items-start">
        <State label="Default">
          <Select>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
            </SelectContent>
          </Select>
        </State>
        <State label="Selected">
          <Select defaultValue="banana">
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
            </SelectContent>
          </Select>
        </State>
        <State label="Disabled">
          <Select disabled>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Pick a fruit" />
            </SelectTrigger>
          </Select>
        </State>
        <State label="Error">
          <Select>
            <SelectTrigger className="w-44" aria-invalid>
              <SelectValue placeholder="Required" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectContent>
          </Select>
        </State>
      </Demo>
    </Category>
  );
}
