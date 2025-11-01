export default function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00F5FF 1px, transparent 1px),
            linear-gradient(to bottom, #00F5FF 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FF00FF 1px, transparent 1px),
            linear-gradient(to bottom, #FF00FF 1px, transparent 1px)
          `,
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}
