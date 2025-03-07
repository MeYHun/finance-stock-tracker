import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { MarketAnalysis } from "./market-analysis";

interface TrackedAssetsProps {
	type: "stock" | "crypto";
	title: string;
}

export function TrackedAssets({ type, title }: TrackedAssetsProps) {
	const [assets, setAssets] = React.useState<string[]>(
		type === "stock" ? ["AAPL", "MSFT", "NVDA"] : ["bitcoin", "ethereum"]
	);
	const [newAsset, setNewAsset] = React.useState("");

	const handleAddAsset = () => {
		if (newAsset && !assets.includes(newAsset.toUpperCase())) {
			setAssets([...assets, newAsset.toUpperCase()]);
			setNewAsset("");
		}
	};

	const handleRemoveAsset = (symbol: string) => {
		setAssets(assets.filter((asset) => asset !== symbol));
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">{title}</h2>
				<div className="flex gap-2">
					<Input
						placeholder={`Add ${type}...`}
						value={newAsset}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setNewAsset(e.target.value)
						}
						className="w-[200px]"
						onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
							if (e.key === "Enter") handleAddAsset();
						}}
					/>
					<Button onClick={handleAddAsset} size="icon">
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{assets.map((symbol) => (
					<div key={symbol} className="relative">
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 top-2 z-10 hover:bg-background/50 backdrop-blur-sm"
							onClick={() => handleRemoveAsset(symbol)}
						>
							<X className="h-4 w-4" />
						</Button>
						<MarketAnalysis symbol={symbol} type={type} />
					</div>
				))}
			</div>
		</div>
	);
}
