"use client";

import { ChangeEvent, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    if (!files) {
      return;
    }

    const previewUrl = URL.createObjectURL(files[0]);
    setFileType(files[0].type);
    setPreview(previewUrl);
  }

  return (
    <>
      <input
        type="file"
        id="media"
        name="coverUrl"
        accept="image/*,video/*"
        className="invisible h-0 w-0"
        onChange={onFileSelected}
      />
      {preview &&
        (fileType === "video/mp4" ? (
          <video
            src={preview}
            width="640"
            height="360"
            controls
            className="w-full aspect-video rounded-lg object-cover"
          />
        ) : (
          // eslint-disable-next-line
          <img
            src={preview}
            alt="Media preview"
            className="w-full aspect-video rounded-lg object-cover"
          />
        ))}
    </>
  );
}
