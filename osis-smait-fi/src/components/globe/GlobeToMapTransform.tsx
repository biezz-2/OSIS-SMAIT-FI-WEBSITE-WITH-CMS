"use client";

import * as d3 from "d3";
import { feature } from "topojson-client";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface GeoFeature {
  type: string;
  geometry: any;
  properties: any;
}

function interpolateProjection(raw0: any, raw1: any) {
  const mutate: any = d3.geoProjectionMutator((t: number) => (x: number, y: number) => {
    const [x0, y0] = raw0(x, y);
    const [x1, y1] = raw1(x, y);
    return [x0 + t * (x1 - x0), y0 + t * (y1 - y0)];
  });
  let t = 0;
  return Object.assign((mutate as any)(t), {
    alpha(_: number) {
      return arguments.length ? (mutate as any)((t = +_)) : t;
    },
  });
}

export function GlobeToMapTransform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [progress] = useState([0]); // Fixed at 0 for globe view only
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState([0, -20]);
  const [translation] = useState([0, 0]);
  
  const width = 800;
  const height = 500;
  
  // Rotation animation state
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Load world data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // Using Natural Earth data from a CDN
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const world: any = await response.json();
        const countries = (feature(world, world.objects.countries) as any).features;
        setWorldData(countries);
        console.log("[v0] Successfully loaded world data with", countries.length, "countries");
      } catch (error) {
        console.log("[v0] Error loading world data:", error);
        // Fallback: create a simple world outline
        const fallbackData = [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90],
                ],
              ],
            },
            properties: {},
          },
        ];
        setWorldData(fallbackData);
      }
    };

    loadWorldData();
  }, []);

  // Auto-rotation animation
  useEffect(() => {
    if (worldData.length === 0) return;

    const animateRotation = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Rotate at approximately 18 seconds per full rotation (360 degrees)
      // 360 degrees / 18000 ms = 0.02 degrees per ms
      const rotationSpeed = 0.02;
      const rotationDelta = deltaTime * rotationSpeed;

      setRotation((prev) => [prev[0] + rotationDelta, prev[1]]);

      animationRef.current = requestAnimationFrame(animateRotation);
    };

    animationRef.current = requestAnimationFrame(animateRotation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [worldData.length]);

  // Initialize and update visualization
  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const t = progress[0] / 100;
    const alpha = Math.pow(t, 0.5);

    const scale = d3.scaleLinear().domain([0, 1]).range([220, 120]);
    const baseRotate = d3.scaleLinear().domain([0, 1]).range([0, 0]);

    const projection = interpolateProjection(d3.geoOrthographicRaw, d3.geoEquirectangularRaw)
      .scale(scale(alpha))
      .translate([width / 2 + translation[0], height / 2 + translation[1]])
      .rotate([baseRotate(alpha) + rotation[0], rotation[1]])
      .precision(0.1);

    projection.alpha(alpha);

    const path = d3.geoPath(projection);

    // Add graticule (grid lines) above ocean fill but below countries
    try {
      const graticule = d3.geoGraticule();
      const graticulePath = path(graticule());
      if (graticulePath) {
        svg
          .append("path")
          .datum(graticule())
          .attr("d", graticulePath)
          .attr("fill", "none")
          .attr("stroke", "#555555")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.3);
      }
    } catch (error) {
      console.log("[v0] Error creating graticule:", error);
    }

    // Add countries with visible stroke
    svg
      .selectAll(".country")
      .data(worldData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", (d) => {
        try {
          const pathString = path(d as any);
          if (!pathString) return "";
          if (typeof pathString === "string" && (pathString.includes("NaN") || pathString.includes("Infinity"))) {
            return "";
          }
          return pathString;
        } catch (error) {
          console.log("[v0] Error generating path for country:", error);
          return "";
        }
      })
      .attr("fill", "transparent")
      .attr("stroke", "#cccccc")
      .attr("stroke-width", 1.2)
      .attr("opacity", 1.0)
      .style("visibility", function () {
        const pathData = d3.select(this).attr("d");
        return pathData && pathData.length > 0 && !pathData.includes("NaN") ? "visible" : "hidden";
      });

    // Draw sphere outline with subtle border
    try {
      const sphereOutline = path({ type: "Sphere" });
      if (sphereOutline) {
        svg
          .append("path")
          .datum({ type: "Sphere" })
          .attr("d", sphereOutline)
          .attr("fill", "none")
          .attr("stroke", "#666666")
          .attr("stroke-width", 1.5)
          .attr("opacity", 0.8);
      }
    } catch (error) {
      console.log("[v0] Error creating sphere outline:", error);
    }

    console.log("[v0] Visualization updated with rotation:", rotation[0]);
  }, [worldData, progress, rotation, translation]);

  return (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full bg-transparent cursor-grab active:cursor-grabbing pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
