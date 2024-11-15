import { Name } from "@fest/types";

function getName(name: Name) {
  console.log(name.name);
  console.log(name.address);
}

getName({ name: "Daksh", address: "dsa" });
