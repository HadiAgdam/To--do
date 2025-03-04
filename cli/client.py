from models import Revenge
from repo import RevenveRepo
from auth import get_key


repo = RevenveRepo()


def add_revenge():
    revenge = Revenge(
        name=input("Target Name :"),
        reason=input("Reason :"),
        vulnerabilities=input("Vulnerabilities :")
    )

    if repo.add_revenge(get_key(), revenge):
        print("\nTarget added !")
    else:
        print("\nFaield !")



def list_revenge():
    revenges = repo.list_revenge(get_key())

    if not revenges:
        print("\nFailed !")
    
    for r in revenges:
        print("\nid: ", r.id)
        print("name: ", r.name)
        print("reason: ", r.reason)
        print("Vulnerabilities: ", r.vulnerabilities)


# Delete a revenge entry
def delete_revenge():
    if repo.delete_revenge(get_key(), input("Revenge ID: ")):
        print("\nDeleted !")
    else:
        print("\nFailed !")

def main():
    while True:
        print("\n ** Revenge CLI **")
        print("1 Add Target")
        print("2 List Targets")
        print("3 Delete Target")
        print("4 Exit")

        choice = input("Choose: ")

        if choice == "1":
            add_revenge()
        elif choice == "2":
            list_revenge()
        elif choice == "3":
            delete_revenge()
        elif choice == "4":
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
