# Content Creator usecase demo

![Screenshot](Screenshot.png)

This project is mainly used as a demo of what can be accomplished with iExec Data Protector SDK, and specifically its ["Sharing" module](https://tools.docs.iex.ec/tools/dataProtector/dataProtectorSharing).

## Project initiated with:

```
npm create vite@latest usecase-demo -- --template react-swc-ts
```

## Main libraries

**TanStack router** (https://tanstack.com/router/latest/docs/framework/react/overview)  
with file-based routing (see `src/routes` folder)

**TanStack Query** (https://tanstack.com/query/latest/docs/framework/react/overview)

**TailwindCSS** (https://tailwindcss.com/docs/guides/vite#react)  
➕  
**shadcn/ui**  (https://ui.shadcn.com/)

#### Fonts:

Base font: _Mulish_

Title font: _Anybody_

#### Various notes

When seeing `userAddress` in the code, it means the currently logged in user's address.  
To designate some other user's address, the variable name will be named differently, for example: `profileAddress`, like in `user.$profileAddress.tsx` component.
