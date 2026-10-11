import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MainColorPicker from "@/components/MainColorPicker";

export default async function Settings() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
// Currently only persists per browser TODO make it persist per user
// (will need a column in userInfo to store this info for user)
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <h1 className="page-heading">Settings</h1>
      <section className="mx-auto w-full max-w-2xl text-center">
        <h2 className="panel-heading">Appearance</h2>
        <MainColorPicker />
      </section>
    </main>
  );
  // TODO We also want to add here an NSFW filter (probably another column)
  // in UserInfo 
  // TODO We also want to add here a Rating Bubbles selection. Users
  // will be able to choose what rating bublles on the app look like for them
  // this will require yet another column in UserInfo
}
