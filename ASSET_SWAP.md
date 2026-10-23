# Replace the fallback illustrations with Ali's photos

The profile is functional immediately using these two self-contained SVG assets:
- assets/hero.svg
- assets/profile-card.svg

To use the TWO ORIGINAL IMAGES supplied in ChatGPT, copy them into the repository:

1. Wide banner -> assets/ali-banner.png
2. Square portrait -> assets/ali-portrait.png

You can extract them from the GitHub Profile Package ZIP shared in ChatGPT. No internet image searches or new AI portrait are required.

Once both PNG files are present, update only these two README.md image sources:
- Replace src="./assets/hero.svg" with src="./assets/ali-banner.png"
- Replace src="./assets/profile-card.svg" with src="./assets/ali-portrait.png"

Commit and push the PNGs and changed README. The blue/cyan layout, typing animation, badges, project links, stats, streak and snake remain unchanged.

Snake animation:
- The workflow is defined in .github/workflows/snake.yml
- GitHub repository -> Actions -> Contribution Snake -> Run workflow
- Once its output branch exists, the snake image in README becomes available
- If publishing is blocked by GitHub permissions, adjust Settings -> Actions -> General -> Workflow permissions

Note: Some public SVG stats providers can be rate-limited; this does not affect the profile text, badges, or store links.
