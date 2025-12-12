import React, { useRef, useState } from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import {
  XMarkIcon,
  PaperClipIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Input } from "@heroui/input";

interface FileInputProps {
  title: string;
  subtitle: string;
  validate: (files: File[]) => Promise<void>;
  validateTitle: string;
  className: string;
  acceptedFormats: string;
}

const MultipleFilesInput = ({
  title,
  subtitle,
  validate,
  validateTitle,
  className,
  acceptedFormats,
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (inputRef.current) inputRef.current.value = "";
    if (file) setFiles([...files, file]);
  };

  const handleOpenFile = () => {
    inputRef.current?.click();
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (inputRef.current) inputRef.current.value = "";

    setFiles([]);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_f, i) => i != index);

    setFiles(newFiles);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <input
        ref={inputRef}
        accept={acceptedFormats}
        className="hidden"
        type="file"
        onChange={handleFileAdd}
      />

      <div className={"grid grid-cols-4"}>
        <Button
          className="w-full col-span-3 justify-start h-12 rounded-tr-none rounded-br-none focus:ring-0"
          color="default"
          startContent={<PaperClipIcon className="w-5 h-5 text-gray-500" />}
          variant="bordered"
          onPress={handleOpenFile}
        >
          {files.length ? (
            <div className="flex justify-between items-center w-full">
              <span className="text-gray-700">{`${files.length} fichiers sélectionnés`}</span>
              <XMarkIcon
                className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={handleClearFile}
              />
            </div>
          ) : (
            <span className="text-gray-500">{title}</span>
          )}
        </Button>
        <Button
          className="w-full col-span-1 h-12 rounded-tl-none rounded-bl-none justify-center-safe focus:ring-0"
          color="default"
          endContent={<PaperAirplaneIcon className="w-5 h-5 text-gray-500" />}
          isLoading={loading}
          variant="solid"
          onPress={() => {
            setLoading(true);
            validate(files).then(() => {
              setFiles([]);
              setLoading(false);
              addToast({
                title: "Scans téléchargés",
                description: "Vos scans ont été téléchargés",
                color: "success",
              });
            });
          }}
        >
          <span>{validateTitle}</span>
        </Button>
      </div>
      {files.map((file, index) => (
        <Input
          key={index}
          readOnly
          endContent={
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => {
                handleRemoveFile(index);
              }}
            >
              {files.length ? (
                <XMarkIcon className="w-4 h-4" />
              ) : (
                <PaperClipIcon className="w-4 h-4" />
              )}
            </Button>
          }
          label={subtitle}
          placeholder="Aucun fichier sélectionné"
          value={file.name}
        />
      ))}
    </div>
  );
};

export default MultipleFilesInput;
