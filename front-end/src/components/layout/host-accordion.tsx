import { Accordion, AccordionItem } from "@heroui/accordion";
import { Chip } from "@heroui/chip"; // Pour les badges de statut
import { Card, CardBody } from "@heroui/card";

import { HostModel } from "@/types/models.ts";

interface HostAccordionProps {
  hosts: HostModel[];
}

const HostAccordion = ({ hosts }: HostAccordionProps) => {
  const STATES = {
    open: "OUVERT",
    closed: "FERMÉ",
    filtered: "FILTRÉ",
  };
  const COLORS = {
    open: "border-green-600 bg-green-200 text-green-800",
    closed: "border-red-400 bg-red-100 text-red-800",
    filtered: "border-orange-400 bg-orange-100 text-orange-800",
    online: "border-blue-400 bg-blue-100 text-blue-800",
    offline: "border-zinc-800 bg-zinc-200 text-zinc-800",
  };

  return (
    <>
      <Accordion
        hideIndicator={true}
        isCompact={true}
        itemClasses={{
          trigger: "focus:outline-none",
          base: "data-[disabled=true]:opacity-70 data-[disabled=true]:cursor-not-allowed",
        }}
        selectionMode="multiple"
        showDivider={false}
        variant="light"
      >
        {hosts.map((host) => (
          <AccordionItem
            key={host.ipv4}
            aria-label={host.ipv4}
            isDisabled={host.state === "offline"}
            title={
              <div className="flex focus:ring-0 justify-between items-center w-full gap-3">
                <Card
                  key={host.ipv4}
                  className={`${COLORS[host.state]} focus:ring-0 w-full shadow-none rounded-none border-2 p-2 px-10`}
                >
                  <CardBody className={"flex flex-row justify-between w-full"}>
                    <span className="font-bold text-large">{host.ipv4}</span>
                    <Chip
                      color={host.state === "online" ? "primary" : "warning"}
                      size="sm"
                      variant="flat"
                    >
                      {host.state === "online" ? "EN LIGNE" : "HORS LIGNE"}
                    </Chip>
                  </CardBody>
                </Card>
              </div>
            }
          >
            <div key={host.ipv4} className="flex flex-col space-y-2 mx-10 my-5">
              {(host.services ?? []).map((service) => (
                <Card
                  key={service.port}
                  className={`shadow-none rounded-small border-2 ${COLORS[service.state]}`}
                >
                  <CardBody className={"grid grid-cols-4 ml-5"}>
                    <span className="grid grid-cols-2 col-span-2">
                      <p key={service.name} className="uppercase">
                        {service.name}
                      </p>
                      <p key={service.port}>
                        {service.port}/{service.protocol}
                      </p>
                    </span>
                    <span className="grow" />
                    <p key={service.state} className="text-left font-bold">
                      {STATES[service.state]}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default HostAccordion;
