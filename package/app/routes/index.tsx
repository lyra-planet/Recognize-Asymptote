import { Link, Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <Link className="btn" to="editDocument" >
        EditIt
      </Link>
      <Link className="btn-icon" to="editDocument" >
        EditIt
      </Link>
      <Outlet/>
    </div>
  );
}
<style>
  
</style>