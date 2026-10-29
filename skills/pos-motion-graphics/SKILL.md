---
name: pos-motion-graphics
description: Rules, micro-interactions, layout physics, and motion graphics design system for Next.js Restaurant POS systems using Framer Motion and tactile animations.
---

# POS Motion Graphics & Tactical Interaction Skill

This skill defines motion graphics, tactile feedback, and animation standards for modern restaurant Point of Sale (POS) interfaces.

## Core Motion Principles for POS

1. **Micro-Spring Tactility (Touch/Click)**
   - Buttons and cards compress slightly on tap (`scale: 0.96` to `0.98`) and spring back quickly (`stiffness: 450`, `damping: 25`).
   - Prevents duplicate accidental clicks and confirms user input immediately.

2. **Cart Entry & Layout Transitions**
   - Items added into ticket enter with smooth scale + slide.
   - Items removed fade and slide out cleanly without jarring layout jumps.
   - Quantity changes trigger a quick pulse animation.

3. **Category Switcher Staggering**
   - When switching between Biryani, Pulao, and Drinks, food cards stagger smoothly into view.

4. **Change Due & Checkout Celebration**
   - Highlighting change calculation with clear visual emphasis and particle confetti celebration.
