export function isMongoObjectId(value: string): boolean {
	// MongoDB ObjectId is a 24-character hex string.
	return /^[a-fA-F0-9]{24}$/.test(value);
}

