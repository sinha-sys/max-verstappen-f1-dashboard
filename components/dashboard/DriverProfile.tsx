"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User } from "lucide-react";

export function DriverProfile() {
  const [isOpen, setIsOpen] = useState(false);

  const profileContent = (
    <div className="space-y-4">
      <section>
        <h3 className="text-lg font-semibold mb-2">About Max Verstappen</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Max Emilian Verstappen is a Dutch Formula 1 driver for <strong>Red Bull Racing</strong>, 
          widely recognized as one of the most dominant competitors in modern motorsport. Born on 
          September 30, 1997, in Hasselt, Belgium, Verstappen made history in 2015 as the{" "}
          <strong>youngest driver ever to start an F1 Grand Prix</strong> at just 17 years old.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          Since his mid-season promotion to Red Bull Racing in 2016 — where he won his debut race 
          at the Spanish Grand Prix — Verstappen has rewritten Formula 1&apos;s record books. His 
          aggressive yet controlled driving style, exceptional racecraft, and consistency have earned 
          him <strong>four consecutive World Championships (2021–2024)</strong> and a place among 
          the sport&apos;s greats.
        </p>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Career Highlights</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Formula 1 debut in 2015 with Toro Rosso at age 17.</li>
          <li>Youngest race winner in F1 history – 2016 Spanish Grand Prix.</li>
          <li>Four-time World Champion (2021, 2022, 2023, 2024).</li>
          <li>Holds single-season records for most wins (19 in 2023) and most points (575 in 2023).</li>
          <li>Leader in sprint race victories and multiple consecutive win streaks.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Driving Style & Strengths</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Verstappen is known for his fearless overtaking, precision under pressure, and adaptability 
          to varying track conditions. His ability to manage tyres while maintaining pace, combined 
          with top-tier qualifying speed, makes him one of the most complete drivers in the history 
          of Formula 1.
        </p>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Off the Track</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Away from the circuit, Verstappen is an avid sim racer, often competing in online endurance 
          events. He has a large global fanbase, significant social media presence, and plays a major 
          role in Red Bull&apos;s brand identity in motorsport.
        </p>
      </section>
    </div>
  );

  return (
    <>
      {/* Desktop Version - Always visible on large screens */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Driver Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profileContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Version - Collapsible on smaller screens */}
      <div className="lg:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Driver Profile
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {profileContent}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </>
  );
}
