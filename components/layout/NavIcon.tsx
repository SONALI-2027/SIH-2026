export function NavIcon({ type, size = 19 }: { type: string; size?: number }) {
	const symbol = type === "alert" ? "!" : type === "hand" ? "+" : type === "clock" ? "◷" : "○";
	return <span aria-hidden="true" className="grid place-items-center rounded-full border-2 border-current font-display font-bold" style={{ width: size, height: size, fontSize: size * 0.65 }}>{symbol}</span>;
}
