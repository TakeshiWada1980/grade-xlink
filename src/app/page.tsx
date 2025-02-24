import NextLink from "next/link";

const Page: React.FC = () => {
  return (
    <main>
      <div className="text-2xl font-bold">Main</div>
      <ul>
        <li>
          <NextLink href="/signup">signup</NextLink>
        </li>
        <li>
          <NextLink href="/login">login</NextLink>
        </li>
        <li>
          <NextLink href="/dashboard">dashboard</NextLink>
        </li>
        <li>
          <NextLink href="/hoge">hoge</NextLink>
        </li>
      </ul>
    </main>
  );
};

export default Page;
