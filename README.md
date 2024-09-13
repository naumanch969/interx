# InterX

**InterX** is a collaborative communication platform designed for teams, providing sound features such as workspaces, channels, direct messaging, and a rich text editor for customizable chat. Inspired by Slack, but with its own unique approach to enhancing team interactions.

## Live Demo

Check out the live demo of interX [here](https://interx.vercel.app/).

## Features

### 1. **User Authentication**
   - Complete authentication system with secure user registration, login, and session management.
   - Ensures data privacy and controlled access to workspaces and conversations.

### 2. **Workspaces**
   - Each user is assigned at least one workspace upon registration.
   - Users can invite others to join their workspace via a unique invite link and a 6-digit workspace password/code, automatically generated for security.
   - Users can manage multiple workspaces and switch between them effortlessly.

### 3. **Channels & Direct Messages**
   - **Channels**: Group discussions where all workspace members can communicate in public or private channels.
   - **Direct Messages**: One-to-one conversations for more personalized communication between workspace members.

### 4. **Rich Text Editor (Quill)**
   - Integrated **Quill.js** editor for customizable chat messages with the following features:
     - Bold, Italic, and other text formatting options.
     - Insert hyperlinks.
     - Bullet and numbered lists.
     - Enhanced formatting for better communication within channels and direct messages.

### 5. **Message Threading**
   - Users can reply to specific messages, creating organized threads within channels or direct conversations.
   - Messages can be edited or deleted by their creators.
   - Threads help keep discussions organized and easy to follow.

### 6. **Roles & Permissions**
   - **Admin Role**: Admins can manage the entire workspace, including channels, users, and workspace settings.
   - **Member Role**: Members can communicate and collaborate within channels but have limited control over workspace settings.
   - Admins can promote or demote members within the workspace as needed.

### 7. **Workspace Management**
   - Admins can invite or remove members, manage channels, and control access to specific parts of the workspace.
   - Manage multiple workspaces for different teams or projects with ease.

## Technologies Used

- **Frontend**: [Next.js](https://nextjs.org/)
- **Database**: [Convex DB](https://convex.dev/) for real-time data handling and storage.
- **Rich Text Editor**: [Quill.js](https://quilljs.com/) for message formatting.
- **Authentication**: Next.js API routes and Convex DB for session management.
- **State Management**: Custom reusable Hooks
  
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [Convex DB](https://convex.dev/) setup for database management
- [Quill.js](https://quilljs.com/) for the rich text editor

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/naumanch969/interX.git
   ```

2. Navigate to the project directory:

   ```bash
   cd interX
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your `.env.local` file with the required environment variables:

   - `CONVEX_DEPLOYMENT`: Convex deployment key.
   - `NEXT_PUBLIC_CONVEX_URL`: Backend URL where the server is running.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` to access the platform locally.

### Environment Variables

Ensure you have the following variables configured in your `.env.local`:

- `CONVEX_DEPLOYMENT`: Convex deployment key.
- `NEXT_PUBLIC_CONVEX_URL`: Backend URL where the server is running.

### Running Production Build

To run the production build, use:

```bash
npm run build
npm start
```

## Usage

- **Create Workspaces**: Once registered, users can create workspaces, invite others, and start collaborating immediately.
- **Channels & Conversations**: Organize conversations in channels or direct messages with advanced text formatting using the Quill editor.
- **Workspace Management**: Admins control the workspace, invite members, and manage roles and permissions.

## Project Structure

```bash
.
├── /convex             # Convex DB setup and queries
├── /src/components     # React components for the UI
├── /src/app            # Next.js pages for routing
├── /src/constants      # All of project constants
├── /src/features       # API features and hooks
├── /src/hooks          # Custom hooks
├── /src/lib            # Utilities
├── /public             # Public assets
```

## Deployment

1. Set up your deployment environment (e.g., Vercel, Netlify, etc.).
2. Push the repository to your GitHub and connect it with the deployment platform.
3. Ensure all environment variables are correctly configured in your deployment settings.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with detailed information about changes or bug fixes.


---
