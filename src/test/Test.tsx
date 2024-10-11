import Button from "@/components/UI/Button";
import { useLazyReadQuery, useUpdateMutation } from "@/services/api";
import { FC } from "react";

const Test: FC = () => {
	const [triggerRead] = useLazyReadQuery();
	const [updateData] = useUpdateMutation();

	const handle = async () => {
		try {
			const response = await triggerRead().unwrap();

			const newUsers = response.users.map((user) =>
				user.id === 1
					? {
							...user,
							latest: {
								films: [],
								duets: [],
							},
					  }
					: user
			);

			await updateData({ ...response, users: newUsers });
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
