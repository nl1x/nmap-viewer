import MultipleFilesInput from "@/components/common/multiple-files-input.tsx";
import API from "@/services/api.ts";
import useHostsContext from "@/hooks/hosts/hosts-provider.tsx";

interface UploadScansProps {
  className: string;
}

const UploadScans = ({ className }: UploadScansProps) => {
  const { setFetch } = useHostsContext();

  return (
    <MultipleFilesInput
      acceptedFormats=".txt"
      className={className}
      subtitle="Fichier sélectionné"
      title="Sélectionnez vos scans nmap"
      validate={async (files: File[]) => {
        await API.upload(files);
        setFetch(true);
      }}
      validateTitle="Télécharger"
    />
  );
};

export default UploadScans;
