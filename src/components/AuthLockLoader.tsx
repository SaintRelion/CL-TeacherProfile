type LoaderComponentProps = {
  unlocked: boolean;
  size: number;
  label: string;
};

const AuthLockLoader = ({ unlocked, size, label }: LoaderComponentProps) => {
  const dotSize = size * 0.2;

  console.log(label);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: dotSize * 0.5 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              opacity: unlocked ? 1 - i * 0.2 : 0.3 + i * 0.2,
              transition: "opacity 0.4s ease-in-out",
            }}
          />
        ))}
      </div>

      {/* Label */}
      {/* <span
        style={{
          fontSize: size * 0.2,
          color: "#374151",
          opacity: 0.9,
        }}
      >
        {label || "Loading..."}
      </span> */}
    </div>
  );
};
export default AuthLockLoader;
