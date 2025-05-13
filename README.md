# PetalBot Frontend (Vite + React + TailwindCSS)

This project is a modern landing page built using **Vite**, **React**, and **Tailwind CSS**. It features a clean, component-driven layout and is styled using Tailwind utility classes. The landing page includes a navbar, hero section, features, assistant preview, call-to-action section, and footer.

---

## 🚀 Tech Stack

- **Vite** — for fast dev and build
- **React** — component-based UI
- **Tailwind CSS** — utility-first styling
- **Flowbite markup** — used for some component layout references

---

## 📁 Project Structure

```bash
src/
├── components/ # All of the components per page
│   └── dashboard   
│   └── landingPage
├── layouts/ # Universal layouts, one for the dashboard, the other for the landing page
│   └── DashboardLayout.tsx
│   └── LandingPage.tsx
├── pages/ # These pages get loaded into the layouts, and they use components.
│   └── landingPage
│       └── HomePage.tsx
│       └── RegisterPage.tsx
│       └── ...
```

So, the entire structure is like this... `components > pages > layouts`. And App.tsx routes everything.