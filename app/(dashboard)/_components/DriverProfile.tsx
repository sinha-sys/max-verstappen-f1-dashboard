"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Trophy, Zap, Target, Flag, ChevronDown, ChevronUp } from "lucide-react";

export function DriverProfile() {
  const [isOpen, setIsOpen] = useState(false);
  
  const highlights = [
    {
      icon: Calendar,
      text: "Formula 1 debut in 2015 with Toro Rosso at age 17",
      badge: "Youngest Debut"
    },
    {
      icon: Trophy,
      text: "Youngest race winner in F1 history – 2016 Spanish Grand Prix",
      badge: "Historic Win"
    },
    {
      icon: Target,
      text: "Four-time World Champion (2021, 2022, 2023, 2024)",
      badge: "Champion"
    },
    {
      icon: Flag,
      text: "Holds single-season records for most wins (19 in 2023) and most points (575 in 2023)",
      badge: "F1 Record"
    },
    {
      icon: Zap,
      text: "Leader in sprint race victories and multiple consecutive win streaks",
      badge: "Sprint Master"
    },
  ];

  return (
    <div>
      {/* Desktop Version - Always Visible */}
      <Card className="hidden lg:block h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Driver Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileContent highlights={highlights} />
        </CardContent>
      </Card>

      {/* Mobile Version - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="lg:hidden">
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Driver Profile
                </CardTitle>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-6">
              <ProfileContent highlights={highlights} />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

function ProfileContent({ highlights }: { highlights: any[] }) {
  return (
    <>
      {/* About Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3">About Max Verstappen</h3>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Max Emilian Verstappen</strong> is a Dutch Formula 1 driver for{" "}
            <strong className="text-foreground">Red Bull Racing</strong>, widely recognized as one of the most 
            dominant competitors in modern motorsport. Born on September 30, 1997, in Hasselt, Belgium, 
            Verstappen made history in 2015 as the{" "}
            <strong className="text-foreground">youngest driver ever to start an F1 Grand Prix</strong> at just 17 years old.
          </p>
          
          <p>
            Since his mid-season promotion to Red Bull Racing in 2016 — where he won his debut race 
            at the Spanish Grand Prix — Verstappen has rewritten Formula 1&apos;s record books. His aggressive 
            yet controlled driving style, exceptional racecraft, and consistency have earned him{" "}
            <strong className="text-foreground">four consecutive World Championships (2021–2024)</strong> and 
            a place among the sport&apos;s greats.
          </p>
        </div>
      </div>

      <Separator />

      {/* Career Highlights */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Career Highlights</h3>
        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-3">
              <highlight.icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{highlight.text}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {highlight.badge}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Driving Style */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Driving Style & Strengths</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Verstappen is known for his fearless overtaking, precision under pressure, 
          and adaptability to varying track conditions. His ability to manage tyres 
          while maintaining pace, combined with top-tier qualifying speed, 
          makes him one of the most complete drivers in the history of Formula 1.
        </p>
      </div>

      <Separator />

      {/* Off Track */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Off the Track</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Away from the circuit, Verstappen is an avid sim racer, often competing in online 
          endurance events. He has a large global fanbase, significant social media presence, 
          and plays a major role in Red Bull&apos;s brand identity in motorsport.
        </p>
      </div>
    </>
  );
}
