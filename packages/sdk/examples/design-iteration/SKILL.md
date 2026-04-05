# Agent Skill: Design Iteration

This skill teaches you how to iteratively improve a generated design by evaluating its output and using the SDK's edit and variants capabilities.

## Workflow

1. **Generate Initial Screen:** Use `project.generate(prompt)` to create a starting point.
2. **Evaluate Output:** Fetch the generated image using `screen.getImage()`. Inspect the visual output to decide what needs improvement.
3. **Iterate:**
   - **Refine Specifics:** If you need specific changes (e.g., "make the button blue"), use `screen.edit("make the button blue")`.
   - **Explore Options:** If the general direction is wrong, use `screen.variants("Try different color schemes", { variantCount: 3, creativeRange: "EXPLORE", aspects: ["COLOR_SCHEME", "LAYOUT"] })`.
4. **Repeat:** Evaluate the new outputs and repeat step 3 until the design meets the user's intent.
