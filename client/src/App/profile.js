import EditBio from "./EditBio";

import WallMessage from "./wallMessage";

export default function Profile({
    first_name,
    last_name,
    img_url,
    bio,
    onBioUpdate,
    user_id,
    default_img,
}) {
    return (
        <>
            <section className="profile">
                <div className="profileCard">
                    <img
                        className="user_img circle"
                        src={img_url}
                        alt={`${first_name} ${last_name}`}
                    />
                    <h3>
                        {first_name} {last_name}
                    </h3>
                    <h4>About me</h4>
                    <EditBio bio={bio} onBioUpdate={onBioUpdate} />
                </div>

                <WallMessage
                    user_id={user_id}
                    img_url={img_url}
                    default_img={default_img}
                />
            </section>
        </>
    );
}
