"use client";

import * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const transactions = [
	{
		id: "1",
		date: "2024-03-20",
		description: "Apple Store",
		amount: -999.0,
		category: "Electronics",
	},
	{
		id: "2",
		date: "2024-03-19",
		description: "Salary Deposit",
		amount: 5000.0,
		category: "Income",
	},
	{
		id: "3",
		date: "2024-03-18",
		description: "Grocery Store",
		amount: -156.32,
		category: "Food",
	},
	{
		id: "4",
		date: "2024-03-17",
		description: "Netflix Subscription",
		amount: -15.99,
		category: "Entertainment",
	},
	{
		id: "5",
		date: "2024-03-16",
		description: "Gas Station",
		amount: -45.67,
		category: "Transportation",
	},
];

export function RecentTransactions() {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Recent Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Category</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow key={transaction.id}>
								<TableCell>{transaction.date}</TableCell>
								<TableCell>{transaction.description}</TableCell>
								<TableCell>{transaction.category}</TableCell>
								<TableCell
									className={`text-right ${
										transaction.amount > 0
											? "text-green-500"
											: "text-red-500"
									}`}
								>
									${Math.abs(transaction.amount).toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
