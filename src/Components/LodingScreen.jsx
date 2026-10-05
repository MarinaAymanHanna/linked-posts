import React from "react";
import { Skeleton } from "@heroui/react";

export default function LodingScreen() {
    return (
        <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-sm p-4">

            {/* Header */}
            <div className="flex items-center gap-3">

                {/* Avatar */}
                <Skeleton className="rounded-full">
                    <div className="w-10 h-10 rounded-full bg-default-300" />
                </Skeleton>

                {/* Name + time */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="rounded-lg">
                        <div className="h-3 w-32 rounded-lg bg-default-300" />
                    </Skeleton>

                    <Skeleton className="rounded-lg">
                        <div className="h-2 w-20 rounded-lg bg-default-300" />
                    </Skeleton>
                </div>

            </div>

            {/* Post Text */}
            <div className="mt-4 flex flex-col gap-2">

                <Skeleton className="rounded-lg">
                    <div className="h-3 w-full rounded-lg bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-300" />
                </Skeleton>

            </div>

            {/* Post Image */}
            <Skeleton className="rounded-lg mt-4">
                <div className="h-64 w-full rounded-lg bg-default-300" />
            </Skeleton>

            {/* Reactions */}
            <div className="flex justify-between mt-4">

                <Skeleton className="rounded-lg">
                    <div className="h-3 w-16 rounded-lg bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-lg">
                    <div className="h-3 w-20 rounded-lg bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-lg">
                    <div className="h-3 w-16 rounded-lg bg-default-300" />
                </Skeleton>

            </div>

            {/* Actions */}
            <div className="flex justify-around mt-5 pt-3 border-t">

                <Skeleton className="rounded-lg">
                    <div className="h-4 w-14 rounded-lg bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-lg">
                    <div className="h-4 w-20 rounded-lg bg-default-300" />
                </Skeleton>

                <Skeleton className="rounded-lg">
                    <div className="h-4 w-14 rounded-lg bg-default-300" />
                </Skeleton>

            </div>

        </div>
    );
}