import { IDuet } from "./services/api";

export function getDuetByUserIds(duets: IDuet[], firstUserId: number, secondUserId: number): IDuet | undefined {
	return duets.find(
		(duet) =>
			(duet.firstUser === firstUserId && duet.secondUser === secondUserId) ||
			(duet.firstUser === secondUserId && duet.secondUser === firstUserId)
	);
}
