'use client'

import Link from "next/link";
import Table from "../../components/users-table";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

// Types
import { Model } from "@/app/lib/definitions";

export default function Users() {
    const users = useSelector((state: any) => state.usersReducer.users);
    const [preset, setPreset] = useState('None');

    return (
        <div>
            <h1 className='text-4xl text-primary'>
                Users
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/* <Search placeholder="Search schedules..." /> */}
                <Link
                    href="/dashboard/users/create"
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <span className="hidden md:block">Create User</span>{' '}
                    {/* <PlusIcon className="h-5 md:ml-4" /> */}
                </Link>
            </div>
            <div className='bg-white w-full mt-8 rounded-lg md:p-8 py-8 px-2 h-auto'>
                <Table users={users} preset={preset} />
            </div>
        </div>
    );
}