import EditBio from "./EditBio";
import MyFriends from "./myFriends";

export default function Profile({
    first_name,
    last_name,
    img_url,
    bio,
    onBioUpdate,
}) {
    return (
        <section className="profile">
            <img
                className="user_img circle"
                src={img_url}
                alt={`${first_name} ${last_name}`}
            />
            <section>
                <h2>
                    {first_name} {last_name}
                </h2>
                <h3>About me</h3>
                <EditBio bio={bio} onBioUpdate={onBioUpdate} />
            </section>
            <section>
                <MyFriends default_img={img_url} />
            </section>
        </section>
    );
}
