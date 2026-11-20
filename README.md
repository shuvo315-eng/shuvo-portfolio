# Shuvo Mitra — Portfolio

Plain HTML5, CSS3 and Vanilla JavaScript. No frameworks.

## Files
- `index.html` — page content and sections
- `style.css` — all styling (colors live at the top in `:root`)
- `script.js` — menu, scroll effects, typing text, photo upload, contact form
- `assets/` — favicon (put your `profile.jpg` here too)

## Your photo
Click the circle on the home section to upload a photo (it stays in your browser).
To show the same photo to every visitor, save it as `assets/profile.jpg` and in
`index.html` replace `<img id="photoImg" alt="Shuvo Mitra" hidden />` with
`<img id="photoImg" src="assets/profile.jpg" alt="Shuvo Mitra" />`
and delete the `<span class="pf-photo-empty" ...>` block below it.

## Deploy
- **GitHub Pages:** push these files to a repo → Settings → Pages → deploy from `main` branch, root folder.
- **Netlify:** drag and drop this folder onto app.netlify.com/drop.
