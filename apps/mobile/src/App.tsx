import { TRPCProvider } from "@/lib/trpc";
import Test from "@/Test";

export default function App()
{
  return (
    <TRPCProvider>
      <Test />
    </TRPCProvider>
  );
}
