class Revenge:
    def __init__(self,
                 name: str,
                 reason: str,
                 vulnerabilities: str,
                 id: str = None
                 ):
        self.name = name
        self.reason = reason
        self.vulnerabilities = vulnerabilities
        self.id = id

    def to_dict(self) -> str:
        return {
            "id": self.id,
            "name": self.name,
            "reason": self.reason,
            "vulnerabilities": self.vulnerabilities
        }