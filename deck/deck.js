const slides = [...document.querySelectorAll(".slide")];
  slides.forEach((slide, i) => {
    const page = document.createElement("div");
    page.className = "page";
    page.textContent = `${i + 1} / ${slides.length}`;
    slide.appendChild(page);
  });
  let current = Math.min(Math.max(Number(location.hash.slice(1)) - 1 || 0, 0), slides.length - 1);
  function show(index) {
    current = Math.min(Math.max(index, 0), slides.length - 1);
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    history.replaceState(null, "", `#${current + 1}`);
  }
  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) show(current + 1);
    else if (["ArrowLeft", "PageUp"].includes(event.key)) show(current - 1);
    else if (event.key === "Home") show(0);
    else if (event.key === "End") show(slides.length - 1);
    else if (event.key.toLowerCase() === "n") document.body.classList.toggle("show-notes");
    else if (event.key.toLowerCase() === "p") window.print();
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    show(current + (event.clientX > window.innerWidth / 3 ? 1 : -1));
  });
  show(current);
