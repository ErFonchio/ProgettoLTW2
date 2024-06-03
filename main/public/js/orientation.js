screen.orientation.addEventListener("change", (event) => {
    const type = event.target.type;
    const angle = event.target.angle;
    console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
  });

window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    console.log(`Screen size change: ${width}px x ${height}px.`);
});