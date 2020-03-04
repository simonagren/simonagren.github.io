---
title: Using REST with Azure CLI
tags: ["azure"]
cover: sitescript.png
author: Simon Ågren
---

![extend](./sitescript.png)

Native support for REST in Azure CLI since V.X

# Prerequisites 
- [Azure Cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [An Azure Account](https://azure.microsoft.com/free/)

# Logic Apps

az rest -m post -u https://management.azure.com/subscriptions/4866dad4-d39c-4a12-9466-de00b6a66718/resourceGroups/RGSimonLA/providers/Microsoft.Logic/workflows/LASimonLA/listCallbackUrl?api-version=2016-06-01 --query value