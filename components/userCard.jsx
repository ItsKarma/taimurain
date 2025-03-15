import getUsers from "./useUsers";

export default function UserCard({ userName }) {
  const { userData, isLoading, isValidating, isError } = getUsers(userName);

  return (
    <section className="w-64 bg-[#20354b] rounded-2xl px-6 py-6 shadow-lg">
      <div className="w-fit mx-auto">
        <img
          src="https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"
          className="rounded-xl"
          alt="profile picture"
          srcSet=""
        />
      </div>

      <div className="mt-8">
        {isLoading || !userData ? (
          <div className="w-1/6 bg-gray-500 h-3 rounded-md"></div>
        ) : (
          <h2 className="text-white font-bold text-2xl tracking-wide">
            {userData.displayName}
          </h2>
        )}
      </div>

      {isLoading || !userData ? (
        <div className="w-1/6 bg-gray-500 h-3 rounded-md"></div>
      ) : (
        <h2 className="text-gray-400 text-sm tracking-wide">
          @{userData.userName}
        </h2>
      )}
      {isLoading || !userData ? (
        <div className="w-1/6 bg-gray-500 h-3 rounded-md"></div>
      ) : (
        <p className="text-emerald-400 font-semibold mt-2.5">
          {userData.status}
        </p>
      )}

      <div className="mt-3 text-white text-sm">
        {isLoading || !userData ? (
          <div className="w-1/6 bg-gray-500 h-3 rounded-md"></div>
        ) : (
          <span className="text-gray-200 font-semibold">
            {userData.description}
          </span>
        )}
      </div>
    </section>
  );
}
