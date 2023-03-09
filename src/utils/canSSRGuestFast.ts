import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export function canSSRGuestFast<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        return await fn(ctx)

    }
}


