import { useState } from "react";
import axios from "axios";
import { FileUploader } from "react-drag-drop-files";

export function DropArea(props: { prefix: string }) {
	const fileTypes = ["JPG", "PNG", "GIF"];
	const [files, setFiles] = useState<FileList | null>(null);

	const handleChange = (file: FileList) => {
		// console.log(file);
		setFiles(file);
	};

	const onDrop = async (files: FileList) => {
		console.log(files);
		const aFiles = Array.from(files);
		console.log(aFiles);
		let formData = new FormData();
		formData.append("prefix", props.prefix);
		aFiles.forEach((file) => {
			formData.append("file", file);
		});
		console.log(formData);
		const res = await axios.post(`/api/s3/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});
		console.log(res);
	};

	return (
		<div className="bg-light py-3">
			<FileUploader
				classes="mx-auto"
				handleChange={handleChange}
				name="file"
				types={fileTypes}
				multiple={true}
				onDrop={onDrop}
				onSelect={onDrop}
			/>
		</div>
	);
}
