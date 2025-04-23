const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div
      className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-200/70 p-12 animate-in fade-in duration-600 shadow-sm"
    >
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`
                aspect-square rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10
                transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-primary/20
                ${i % 2 === 0 ? "animate-pulse" : ""}
                delay-${i * 50}
              `}
            />
          ))}
        </div>
        <h2
          className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-in slide-in-from-bottom-2 duration-400"
        >
          {title}
        </h2>
        <p
          className="text-base-content/60 transition-opacity duration-300 hover:opacity-80 animate-in slide-in-from-bottom-2 duration-400 delay-50"
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;