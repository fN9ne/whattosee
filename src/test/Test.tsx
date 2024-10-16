import Button from "@/components/UI/Button";
import { useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { FC } from "react";

const Test: FC = () => {
	const [triggerRead] = useLazyReadQuery();
	const [updateData] = useUpdateMutation();

	const handle = async () => {
		try {
			const response = await triggerRead().unwrap();

			await updateData({ ...response, items: [], duets: [] });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Button onClick={handle}>/</Button>
		</div>
	);
};

export default Test;
