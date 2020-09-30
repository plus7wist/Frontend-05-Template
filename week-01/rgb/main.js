function iife(fn) {
  fn();
}

function toggleLight(lights, i) {
  for (const light of lights) {
    light.classList.remove("light");
  }
  lights[i].classList.add("light");
}

function sleepSeconds(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function lightsLoop(lights) {
  let seconds = [1, 2, 1];
  while (true) {
    for (let i = 0; i < 3; i++) {
      toggleLight(lights, i);
      await sleepSeconds(seconds[i]);
    }
  }
}

iife(() => {
  const lightNames = ["red", "green", "yellow"];
  const lights = lightNames.map((name) => document.getElementById(name));

  document
    .getElementById("btn-start")
    .addEventListener("click", () => lightsLoop(lights));
});
