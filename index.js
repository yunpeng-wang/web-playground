const el = document.querySelector(".rainbow-jump");
let t = 0;

function animate() {
  t += 0.02;
  const x = Math.sin(t) * 100; // 左右摆
  const y = -Math.pow(Math.cos(t), 2) * 50; // 上下形成弧线
  el.style.transform = `translate(${x}px, ${y}px) rotate(${x / 10}deg)`;
  requestAnimationFrame(animate);
}

animate();